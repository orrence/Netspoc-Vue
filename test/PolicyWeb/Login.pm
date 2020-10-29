package PolicyWeb::Login;

use Test::More;

# This function runs the tests for the login
# Argument 0 => The browser for the tests
sub test {
    my ($browser) = @_;
    subtest 'Load page' => sub {test_load($browser)};
    subtest 'login elements' => sub {test_find_login($browser)};
    subtest 'fail to login' => sub {test_fail_login($browser)};
    subtest 'login as netspoc.test' => sub {test_login($browser)};
    subtest 'top elements' => sub {test_find_top_buttons($browser)};
}

# This function loads the web application
# Argument 0 => The browser for the tests
sub test_load {
    my ($browser) = @_;
    $browser->get('/index.html');
    sleep 1;
    ok($browser->get_current_url() =~ '/login', 'Login page');
}

# This function searches the login elements
# Argument 0 => The browser for the tests
sub test_find_login {
    my ($browser) = @_;
    ok(1 == scalar @{$browser->find_elements('//input[@id="txt_login"]')}, 'Found input text login');
    ok(1 == scalar @{$browser->find_elements('//input[@id="txt_password"]')}, 'Found input text password');
    ok(1 == scalar @{$browser->find_elements('//button[@id="btn_login"]')}, 'Found button login');
}

# This function tests a login with wrong credentials
# Argument 0 => The browser for the tests
sub test_fail_login {
    my ($browser) = @_;
    $browser->find_element('//input[@id="txt_login"]')->send_keys('not-guest');
    $browser->find_element('//input[@id="txt_password"]')->send_keys('qwertz');
    $browser->find_element('//button[@id="btn_login"]')->click();
    sleep 1;
    ok($browser->get_current_url() =~ '/login', 'Login as not-guest failed');
    $browser->clear_input($browser->find_element('//input[@id="txt_login"]'));
}

# This function tests a login with correct credentials
# Argument 0 => The browser for the tests
sub test_login {
    my ($browser) = @_;
    $browser->find_element('//input[@id="txt_login"]')->send_keys('guest');
    $browser->find_element('//button[@id="btn_login"]')->click();
    sleep 1;
    ok($browser->get_current_url() =~ '/services/0', 'Login as guest');
    $browser->select_policy('p1');
}

# This function tests the navigation buttons
# Argument 0 => The browser for the tests
sub test_find_top_buttons {
    my ($browser) = @_;
    ok(1 == scalar @{$browser->find_elements('//a[@id="tab_services"]')}, 'Found button services tab');
    ok(1 == scalar @{$browser->find_elements('//a[@id="tab_networks"]')}, 'Found button networks tab');
    ok(1 == scalar @{$browser->find_elements('//a[@id="tab_diff"]')}, 'Found button differences tab');
    ok(1 == scalar @{$browser->find_elements('//input[@id="combo_policy"]')}, 'Found combo box policy');
    ok(1 == scalar @{$browser->find_elements('//input[@id="combo_owner"]')}, 'Found combo box owner');
    ok(1 == scalar @{$browser->find_elements('//button[@id="btn_logout"]')}, 'Found button logout');
}

1;
