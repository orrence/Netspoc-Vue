#!perl
use lib 'test';
use PolicyWeb::Init;
use Selenium::Remote::Driver;

$selenium_port = scalar @ARGV >= 1 ? $ARGV[0] : '4444';
PolicyWeb::Init::prepare_export();
($server, $port) = PolicyWeb::Init::prepare_runtime_base();
PolicyWeb::Init::setup_diff();
$browser = Selenium::Remote::Driver->new('browser_name' => 'chrome', 'base_url' => "http://$server:$port", port => "$selenium_port");
$browser->get('/index.html');
sleep 60000;
