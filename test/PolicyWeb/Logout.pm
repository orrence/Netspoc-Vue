package PolicyWeb::Logout;

use Test::More;

# This function tests the logout
# Argument 0 => The t´browser for the tests
sub test {
    my ($browser) = @_;
    subtest 'logout elements' => sub {test_find_elements($browser)};
    subtest 'logout' => sub {test_logout($browser)};
}

# This function tests if the logout elements exist
# Argument 0 => The t´browser for the tests
sub test_find_elements {
    my ($browser) = @_;
    ok($browser->find_element('//button[@id="btn_logout"]'), 'Found button logout');
}

# This function test the logout button
# Argument 0 => The t´browser for the tests
sub test_logout {
   my ($browser) = @_;
   $browser->find_element('//button[@id="btn_logout"]')->click();
   sleep 1;
   ok($browser->get_current_url() =~ '/login', 'Logout successfull');
}

1;
