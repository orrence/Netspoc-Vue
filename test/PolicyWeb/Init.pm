package PolicyWeb::Init;

use strict;
use warnings;
use File::Find;
use Cwd 'abs_path';
use Test::More;
use Test::Differences;
use lib 'bin';
use IPC::Run3;
use File::Temp qw/tempfile tempdir/;
use Plack::Test::Server;
use File::Spec::Functions qw/ file_name_is_absolute splitpath catdir catfile /;
use File::Path 'make_path';
use Plack::App::File;
use JSON;
use HTTP::Request::Common;
use Plack::Builder;

our $SERVER = "127.0.0.1";
our $port;
our $policy = 'p0';
our $export_dir;

############################################################
# Shared Netspoc configuration
############################################################
our $netspoc = <<'END';
owner:Axolotl = { admins = guest; }
owner:Blutegel = { admins = guest; }
owner:Chinchilla = { admins = guest; }
owner:Dachs = { admins = guest; }
owner:Eule = { admins = guest; }
owner:Flamingo = { admins = guest; }
owner:Gundi = { admins = guest; }
owner:Hermelin = { admins = guest; }
owner:Igeltanreks = { admins = guest; }
owner:Josephinenlori = { admins = guest; }
owner:Kondor = { admins = guest; }
owner:Lemming = { admins = guest; }
owner:Mungo = { admins = guest; }
owner:Nerz = { admins = guest; }
owner:Otter = { admins = guest; }
owner:Python = { admins = guest; }
owner:Qualle = { admins = guest; }
owner:Regenwurm = { admins = guest; }
owner:Steinbock = { admins = guest; }
owner:x = { admins = guest; show_all; }
owner:y = { admins = guest; }
owner:z = { admins = guest; }

area:all = { owner = x; anchor = network:Big; }
any:Big  = { link = network:Big; }
any:Sub1 = { ip = 10.1.2.0/23; link = network:Big; }
any:Sub2 = { ip = 10.1.1.0/25; link = network:Big; }

network:Sub = { ip = 10.1.1.0/24; owner = z; subnet_of = network:Big; }
router:u = {
 interface:Sub;
 interface:L = { ip = 10.3.3.3; loopback; }
 interface:Big = { ip = 10.1.0.2; }
}
network:Big = {
 ip = 10.1.0.0/16;
 host:B10 = { ip = 10.1.0.10; owner = z; }
 host:Range = { range = 10.1.0.90-10.1.0.99; }
}

router:asa = {
 managed;
 model = ASA;
 routing = manual;
 interface:Big    = { ip = 10.1.0.1; hardware = outside; }
 interface:Kunde  = { ip = 10.2.2.1; hardware = inside; }
 interface:KUNDE  = { ip = 10.2.3.1; hardware = inside; }
 interface:KUNDE1 = { ip = 10.2.4.1; hardware = inside; }
 interface:DMZ    = { ip = 10.9.9.1; hardware = dmz; }
}

network:Kunde  = { ip = 10.2.2.0/24; owner = y; host:k  = { ip = 10.2.2.2; } }
network:KUNDE  = { ip = 10.2.3.0/24; owner = y; host:K  = { ip = 10.2.3.3; } }
network:KUNDE1 = { ip = 10.2.4.0/24; owner = y; host:K1 = { ip = 10.2.4.4; } }
any:Kunde = { link = network:Kunde; }

network:DMZ = { ip = 10.9.9.0/24; }
any:DMZ10 = { ip = 10.0.0.0/8; link = network:DMZ; }

router:inet = {
 interface:DMZ;
 interface:Internet;
}

network:Internet = { ip = 0.0.0.0/0; has_subnets; }

service:Test1 = {
 user = network:Sub;
 permit src = user; dst = network:Kunde; prt = tcp 80;
}

service:Test2 = {
 description = My foo
 user = network:Big, any:Sub1;
 permit src = user; dst = host:k; prt = udp 80;
}

service:Test3 = {
 user = network:Sub;
 permit src = user; dst = network:Kunde; prt = tcp 81;
}

service:Test3a = {
 multi_owner;
 user = network:Sub;
 permit src = user; dst = network:Kunde; prt = tcp 80;
 permit src = user; dst = network:DMZ; prt = tcp 81;
}

service:Test4 = {
 description = Your foo
 multi_owner;
 user = host:B10, host:k, host:Range, interface:u.Big, network:DMZ;
 permit src = user; dst = host:k; prt = tcp 81;
 permit src = user; dst = host:B10; prt = tcp 82;
}

service:Test5 = {
 user = any:Big;
 permit src = user; dst = host:k; prt = tcp 82;
}

service:Test6 = {
 user = host:B10;
 permit src = user; dst = any:Kunde; prt = udp 82;
}

service:Test7 = {
 user = host:B10;
 permit src = user; dst = network:Internet; prt = udp 82;
}

service:Test8 = {
 user = host:B10;
 permit src = user; dst = any:DMZ10; prt = udp 82;
}

service:Test9 = {
 user = host:B10, host:k;
 permit src = user; dst = user; prt = udp 83;
}

service:Test10 = {
 user = network:Sub;
 permit src = user; dst = network:KUNDE; prt = tcp 84;
}

service:Test11 = {
 user = network:Sub;
 permit src = user; dst = network:KUNDE1; prt = tcp 84;
}

END
############################################################

$export_dir = tempdir( CLEANUP => 1 );

sub prepare_in_dir {
    my ($input) = @_;

    # Prepare input directory and file(s).
    # Input is optionally preceeded by single lines of dashes
    # followed by a filename.
    # If no filenames are given, a single file named STDIN is used.
    my $delim = qr/^-+[ ]*(\S+)[ ]*\n/m;
    my @input = split( $delim, $input );
    my $first = shift @input;

    # Input does't start with filename.
    # No further delimiters are allowed.
    if ($first) {
        if (@input) {
            BAIL_OUT("Only a single input block expected");
            return;
        }
        @input = ( 'STDIN', $first );
    }
    my $in_dir = tempdir( CLEANUP => 1 );
    while (@input) {
        my $path = shift @input;
        my $data = shift @input;
        if ( file_name_is_absolute $path) {
            BAIL_OUT("Unexpected absolute path '$path'");
            return;
        }
        my ( undef, $dir, $file ) = splitpath($path);
        my $full_dir = catdir( $in_dir, $dir );
        make_path($full_dir);
        my $full_path = catfile( $full_dir, $file );
        open( my $in_fh, '>', $full_path ) or die "Can't open $path: $!\n";
        print $in_fh $data;
        close $in_fh;
    }
    return $in_dir;
}

# Add export-netspoc to PATH
$ENV{PATH} = "$ENV{HOME}/Netspoc/bin/:$ENV{PATH}";

sub prepare_export {
    my ($input) = @_;
    $input ||= $netspoc;
    my $in_dir = prepare_in_dir($input);
    my ($counter) = $policy =~ /^p(\d+)/;
    $counter++;
    $policy = "p$counter";
    my $cmd = "export-netspoc --quiet $in_dir $export_dir/$policy";
    my ( $stdout, $stderr );
    run3( $cmd, \undef, \$stdout, \$stderr );
    my $status = $?;
    $status == 0 or die "Export failed:\n$stderr\n";
    $stderr and die "Unexpected output during export:\n$stderr\n";
    system("echo '# $policy #' > $export_dir/$policy/POLICY") == 0 or die $!;
    system("cd $export_dir; rm -f current; ln -s $policy current") == 0
      or die $!;
}

our $home_dir = tempdir( CLEANUP => 1 );
my $conf_file = "$home_dir/policyweb.conf";
my $conf_data = <<END;
{
 "netspoc_data"         : "$export_dir",
 "user_dir"             : "$home_dir/users",
 "session_dir"          : "$home_dir/sessions",
 "noreply_address"      : "noreply",
 "business_units"       : "",
}
END

our $cookie;
our $app;

# $server needs to be global, otherwise the plack server
# would get deleted after prepare_runtime_base
my $server;

sub prepare_runtime_base {

    # Prepare config file for netspoc.psgi
    open( my $fh, '>', $conf_file ) or die "Can't open $conf_file";
    print $fh $conf_data;
    close $fh;

    # Different paths on travis vm.
    # Read HOME, before it is overwritten below.
    my $BUILD_DIR = $ENV{TRAVIS_BUILD_DIR} || "$ENV{HOME}/Netspoc-Vue";

    # netspoc.psgi searches config file in $HOME directory.
    local $ENV{HOME} = $home_dir;
    my $netspoc_psgi = do './bin/netspoc.psgi'
      or die "Couldn't parse PSGI file: $@";
    $app = builder {

       #mount '/' => Plack::App::File->new( root => "$BUILD_DIR/dist" )->to_app;
       #mount '/backend' => $netspoc_psgi;
        mount '/netspocvue' =>
          Plack::App::File->new( root => "$BUILD_DIR/dist" )->to_app;
        mount '/netspocvue/backend' => $netspoc_psgi;
    };
    $server = Plack::Test::Server->new($app);
    $port   = $server->port();
    return ( $SERVER, $port );
}

sub setup_diff {
    local $ENV{HOME} = $home_dir;
    make_visible( $home_dir, 'bin' );
    make_visible( $home_dir, 'mail' );

    # Create users directory
    # - to calm down del_obsolete_users.pl and
    # - to store attribute 'send_diff'
    mkdir "$home_dir/users" or die $!;

    # set timestamps to last day
    my $timestamp = time() - 60 * 60 * 24;
    set_timestamp_of_files( $export_dir, $timestamp );
    my $mail = cleanup_daily();

    # changes to the policy
    $netspoc =~ s/\nservice:Test10(.+\n)*\}\n//g;
    $netspoc =~
s/service:Test11(.+\n)*\}\n/service:Test11 = {\n user = network:Sub;\n permit src = user; dst = network:KUNDE1; prt = tcp 83;\n}/g;
    $netspoc = $netspoc
      . "\nservice:Test12 = {\n user = network:Sub;\n permit src = user; dst = network:KUNDE1; prt = tcp 83;\n}";

    # new policy is from the actuall time
    $timestamp = time();
    my $policy_num = 2;
    export_netspoc( $netspoc, $export_dir, $policy_num++, $timestamp );
    $mail = cleanup_daily();
}

sub set_timestamp_of_files {
    my ( $path, $timestamp ) = @_;
    find( sub { -f and utime( $timestamp, $timestamp, $_ ) }, $path );
}

sub export_netspoc {
    my ( $input, $export_dir, $policy_num, $timestamp ) = @_;
    my $policy = "p$policy_num";
    my ( $in_fh, $filename ) = tempfile( UNLINK => 1 );
    print $in_fh $input;
    close $in_fh;
    my $policy_path = "$export_dir/$policy";
    my $cmd         = "export-netspoc --quiet $filename $policy_path";
    run($cmd);
    system("echo '# $policy #' > $policy_path/POLICY") == 0 or die $!;
    system("cd $export_dir; ln -sfT $policy current") == 0  or die $!;
    set_timestamp_of_files( $policy_path, $timestamp );
}

sub cleanup_daily {
    my $cmd = "bin/cleanup_daily";
    return run($cmd);
}

sub run {
    my ($cmd) = @_;
    my ( $stdout, $stderr );
    run3( $cmd, \undef, \$stdout, \$stderr );
    my $status = $?;
    $status == 0 or die "'$cmd' failed:\n$stderr\n";
    $stderr and die "Unexpected output on STDERR during '$cmd':\n$stderr\n";
    return $stdout;
}

sub make_visible {
    my ( $home_dir, $path ) = @_;
    my $abs = abs_path($path) or die "Can't find '$path' directory: $!";
    -d "$home_dir/Netspoc-Web" or mkdir "$home_dir/Netspoc-Web" or die $!;
    symlink $abs, "$home_dir/Netspoc-Web/$path" or die $!;
}

1;
