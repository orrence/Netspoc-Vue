#!perl
# Note: Execute 'npm run build' before running this test
# Argument 0 => (Optional) Selenium server port (Default => 4444)

use lib 'test';
use PolicyWeb::Browser;

$port = scalar @ARGV >= 1 ? $ARGV[0] : "4444";
$browser = PolicyWeb::Browser::get_browser($port);
$browser->get('/index.html');
sleep 2000000000;
