#!perl
# Argument 0 => (Optional) Selenium server port (Default => 4444)

use Test::More;
use lib 'test';
use PolicyWeb::Browser;
use PolicyWeb::Login;
use PolicyWeb::Networks;
use PolicyWeb::Services;
use PolicyWeb::Differences;
use PolicyWeb::Logout;

$port = scalar @ARGV >= 1 ? $ARGV[0] : "4444";
$browser = PolicyWeb::Browser::get_browser($port);
subtest 'Login' => sub {PolicyWeb::Login::test($browser)};
subtest 'Networks' => sub {PolicyWeb::Networks::test($browser)};
subtest 'Services' => sub{PolicyWeb::Services::test($browser)};
subtest 'Differences' => sub {PolicyWeb::Differences::test($browser)};
subtest 'Logout' => sub {PolicyWeb::Logout::test($browser)};
$browser->close();
