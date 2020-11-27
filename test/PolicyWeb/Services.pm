package PolicyWeb::Services;

use Test::More;

# This function runs the tests for the service tab, when logged in
# Argument 0 => The browser for the tests
sub test {
    my ($browser) = @_;
    subtest 'Navigate' => sub {test_navigate($browser)};
    subtest 'Service buttons' => sub {test_service_buttons($browser)};
    subtest 'Own services grid' => sub {test_own_services($browser)};
    subtest 'Service details' => sub {test_service_details($browser)};
    subtest 'Search' => sub {test_search($browser)};
   
}

# This function tests the navigation tab
# Argument 0 => The browser for the tests
sub test_navigate {
    my ($browser) = @_;
    $browser->find_element_by_id('tab_services')->click();
    ok($browser->get_current_url() =~ '/services', 'Networks tab');
}

# This function tests the service buttons
# Argument 0 => The browser for the tests
sub test_service_buttons {
    my ($browser) = @_;
    ok(1 == scalar @{$browser->find_elements('//div[contains(@class, "v-tab") and contains(text(), "Eigene")]')}, 'Button: Eigene');
    ok(1 == scalar @{$browser->find_elements('//div[contains(@class, "v-tab") and contains(text(), "Genutzte")]')}, 'Button: Genutzte');
    ok(1 == scalar @{$browser->find_elements('//div[contains(@class, "v-tab") and contains(text(), "Nutzbare")]')}, 'Button: Nutzbare');
    ok(1 == scalar @{$browser->find_elements('//div[contains(@class, "v-tab")]/i[contains(@class, "v-icon") and contains(text(), "search")]')}, 'Button: Suche');
    ok(1 == scalar @{$browser->find_elements('//div[contains(@class, "v-window-item--active")]/div[@id="table_services_own"]//span[contains(@class, "material-icons") and contains(text(), "picture_as_pdf")]')}, 'Button: Download Services PDF');
    ok(1 == scalar @{$browser->find_elements('//div[contains(@class, "v-window-item--active")]/div[@id="table_services_own"]//span[contains(@class, "material-icons") and contains(text(), "border_all")]')}, 'Button: Download Services XLSX');
    my $details = $browser->find_element('//div[contains(@class, "v-tab") and contains(text(), "Details zum Dienst")]');
    ok($details, 'Button: Details zum Dienst');
    ok(1 == scalar @{$browser->find_elements('//div[contains(@class, "v-tab") and contains(text(), "Benutzer (User) des Dienstes")]')}, 'Button: Benutzer (User) des Dienstes');
    ok(1 == scalar @{$browser->find_child_elements($details, '//div[@id="table_services_rules"]//span[contains(@class, "material-icons") and contains(text(), "picture_as_pdf")]')}, 'Button: Download Details PDF');
    ok(1 == scalar @{$browser->find_child_elements($details, '//div[@id="table_services_rules"]//span[contains(@class, "material-icons") and contains(text(), "border_all")]')}, 'Button: Download Details XLSX');
    ok(1 == scalar @{$browser->find_child_elements($details, '//div[@id="table_admins"]//span[contains(@class, "material-icons") and contains(text(), "picture_as_pdf")]')}, 'Button: Download Owner PDF');
    ok(1 == scalar @{$browser->find_child_elements($details, '//div[@id="table_admins"]//span[contains(@class, "material-icons") and contains(text(), "border_all")]')}, 'Button: Download Owner XLSX');
}

# This function tests the table for the own services
# Argument 0 => The browser for the tests
sub test_own_services {
    my ($browser) = @_;
    my $own = $browser->find_element('//div[contains(@class, "v-tab") and contains(text(), "Eigene")]');
    $own->click();
    my $container = $browser->find_element('//div[contains(@class, "v-window-item--active")]/div[@id="table_services_own"]');
    my $table = $browser->find_child_element($container, './/div[contains(@class, "tabulator")]');
    ok($table, 'Table: Own services');
    my @rows = $browser->find_child_elements($table, './/div[contains(@class, "tabulator-row")]');
    my $head_text = $browser->find_child_element($container, './/div[contains(text(), "' .(scalar @rows) . ' Dienste verf")]');
    ok($head_text, 'Found head and it contains number of elements');
    my @contains = ('Test1', 'Test10', 'Test11', 'Test2', 'Test3', 'Test3a', 'Test4', 'Test5', 'Test6', 'Test7', 'Test8', 'Test9');
    ok($browser->grid_contains($table, 'name', \@contains), 'Grid contains all test services');
    ok($browser->check_grid_order($table), 'Grid changes correctly');
    ok($browser->download($browser->find_child_element($container, './/span[contains(@class, "material-icons") and contains(text(), "picture_as_pdf")]'), /\.pdf$/), 'Download Services PDF');
    ok($browser->download($browser->find_child_element($container, './/span[contains(@class, "material-icons") and contains(text(), "border_all")]'), /\.xlsx$/), 'Download Services XLSX');
}

# This method checks the details table
# Argument 0 => The browser for the tests
sub test_service_details {
    my ($browser) = @_;
    my $services = $browser->find_element('//div[contains(@class, "v-window-item--active")]/div[@id="table_services_own"]');
    my $details = $browser->find_element('//div[@id="table_services_rules"]');
    my $owner = $browser->find_element('//div[@id="table_admins"]');
    $browser->find_child_element($services, './/div[contains(@class, "tabulator-cell") and contains(text(), "Test4")]')->click();
    # Check checkboxes and description
    my $input_expand_users = $browser->find_element('//input[@id="cb_expand_user"]/../../../..');
    ok($input_expand_users, 'Found checkbox: Expand users');
    my $input_show_names = $browser->find_element('//input[@id="cb_show_names"]/../../../..');
    ok($input_show_names, 'Found checkbox: Show names');
    ok(1 == scalar @{$browser->find_elements('//input[@id="cb_filter_search"]')}, 'Found checkbox: Filter search');
    ok(1 == scalar @{$browser->find_elements('//div[contains(text(), "Beschreibung:")]/../..//div[contains(text(), "Your foo")]')}, 'Description: Your foo');
    # Check service table header
    @titles = $browser->find_child_elements($details, './/div[@class="tabulator-col-title"]');
    @regex = ('Aktion', 'Quelle', 'Ziel', 'Protokoll');
    ok($browser->check_grid_syntax(\@titles, \@regex), 'Details grid header are correct');
    # Check service table syntax
    @rules = $browser->find_child_elements($details, './/div[@class="tabulator-cell"]');
    @regex = ('permit', 'User', '\d\d?\d?\.\d\d?\d?\.\d\d?\d?\.\d\d?\d?', '(udp|tcp) \d+');
    ok($browser->check_grid_syntax(\@rules, \@regex), 'Grid syntax is correct');
    # Check expanded users
    $input_expand_users->click();
    @rules = $browser->find_child_elements($details, './/div[@class="tabulator-cell"]');
    $regex[1] = '\d\d?\d?\.\d\d?\d?\.\d\d?\d?\.\d\d?\d?';
    ok($browser->check_grid_syntax(\@rules, \@regex), 'Users expand correctly');
    # Check names instead of IPs
    $input_show_names->click();
    @rules = $browser->find_child_elements($details, './/div[@class="tabulator-cell"]');
    $regex[1] = '(any|network|interface|host):.+';
    $regex[2] = '(any|network|interface|host):.+';
    ok($browser->check_grid_syntax(\@rules, \@regex), 'Names instead of IPs');
    # Check details table order
    my $table = $browser->find_child_element($details, './/div[@class="tabulator"]');
    TODO: {
        local $TODO = "Details grid is not sortable";
        ok($browser->check_grid_order($table), 'Details grid changes correctly');
    }
    # Check details download
    ok($browser->download($browser->find_child_element($details, './/span[@class="material-icons" and text()="picture_as_pdf"]'), /\.pdf$/), 'Download Services PDF');
    ok($browser->download($browser->find_child_element($details, './/span[@class="material-icons" and text()="border_all"]'), /\.xlsx$/), 'Download Services XLSX');
    # Check owner
    $browser->move_to(element => $owner);
    @rules = $browser->find_child_elements($owner, './/div[@class="tabulator-cell"]');
    @regex = ('guest');
    $table = $browser->find_child_element($owner, './/div[@class="tabulator"]');
    ok($browser->check_grid_syntax(\@rules, \@regex), 'guest is Owner');
    ok($browser->check_grid_order($table), 'Owner grid changes correctly');
    # Check owner download
    ok($browser->download($browser->find_child_element($owner, './/span[@class="material-icons" and text()="picture_as_pdf"]'), /\.pdf$/), 'Download Owner PDF');
    ok($browser->download($browser->find_child_element($owner, './/span[@class="material-icons" and text()="border_all"]'), /\.xlsx$/), 'Download Owner XLSX');
    # Scroll back to top
    $browser->execute_script('window.scrollTo(0,0)');
}

# This function tests the search
# Argument 0 => The browser for the tests
sub test_search {
    my ($browser) = @_;
    my $search_options = $browser->find_element('.//button[@id="btn_open_search"]');
    
    $search_options->click();
    sleep 1;
    # Find search inputs
    
    my $container = $browser->find_element('.//div[@id="searchbar"]');

    my $input_ip1 = $browser->find_child_element($container, './/input[@id="txtf_search_ip1"]');
    ok($input_ip1, 'Found input field: IP1');
    my $input_ip2 = $browser->find_child_element($container, './/input[@id="txtf_search_ip2"]');
    ok($input_ip2, 'Found input field: IP2');
    my $input_protocol = $browser->find_child_element($container, './/input[@id="txtf_search_proto"]');
    ok($input_protocol, 'Found input field: Protocol');
    my $input_supernet = $browser->find_child_element($container, './/input[@id="cb_search_supernet"]/../../../..');
    ok($input_supernet, 'Found checkbox: Supernet');
    my $input_subnet = $browser->find_child_element($container, './/input[@id="cb_search_subnet"]/../../../..');
    ok($input_subnet, 'Found checkbox: Subnet');
    ok(1 == scalar @{$browser->find_child_elements($container, './/input[@id="cb_search_range"]')}, 'Found checkbox: Port range');
    ok(1 == scalar @{$browser->find_child_elements($container, './/input[@id="cb_search_own"]')}, 'Found checkbox: Own services');
    my $input_used = $browser->find_child_element($container, './/input[@id="cb_search_used"]/../../../..');
    ok($input_used, 'Found checkbox: Used services');
    ok(1 == scalar @{$browser->find_child_elements($container, './/input[@id="cb_search_usable"]')}, 'Found checkbox: Usable services');
    ok(1 == scalar @{$browser->find_child_elements($container, './/input[@id="cb_search_limited"]')}, 'Found checkbox: Temporary services');
    my $input_case = $browser->find_child_element($container, './/input[@id="cb_search_case_sensitive"]/../../../..');
    ok($input_case, 'Found checkbox: Case sensitive');
    my $input_exact = $browser->find_child_element($container, './/input[@id="cb_search_exact"]/../../../..');
    ok($input_exact, 'Found checkbox: Exact');
    my $input_start = $browser->find_child_element($container, './/button[@id="btn_search_start"]');
    ok($input_start, 'Found Button: Start');
    # Search
    $input_ip1->send_keys('10.2.2.2');
    $input_subnet->click();
    $input_used->click();
    check_search_result($browser, 4, '4 results for: IP 1 = 10.2.2.2');
    # Search
    $input_supernet->click();
    check_search_result($browser, 8, '8 results for: IP 1 = 10.2.2.2 and supernet');
    # Search
    $input_ip2->send_keys('10.9.9.0');
    check_search_result($browser, 2, '2 results for: IP 1 = 10.2.2.2, IP 2 = 10.9.9.0 and supernet');
    # Search
    $input_protocol->send_keys('83');
    check_search_result($browser, 1, '1 result for: IP 1 = 10.2.2.2, IP 2 = 10.9.9.0, protocol 83 and supernet');
    # Search
    $browser->clear_input($input_ip1);
    $browser->clear_input($input_ip2);
    $browser->clear_input($input_protocol);
    $input_supernet->click();
    $input_ip1->send_keys('sub1');
    check_search_result($browser, 1, '1 result for: IP 1 = sub1');
    # Search
    $input_case->click();
    check_search_result($browser, 0, '0 results for: IP 1 = sub1 and case sensitive');
    # Search
    $browser->clear_input($input_ip1);
    $input_ip1->send_keys('Sub1');
    check_search_result($browser, 1, '1 result for: IP 1 = Sub1 and case sensitive');
    # Search
    $input_case->click();
    $input_exact->click();
    $browser->clear_input($input_ip1);
    $input_ip1->send_keys('sub1');
    check_search_result($browser, 0, '0 results for: IP 1 = sub1 and exact');
    # Search
    $browser->clear_input($input_ip1);
    $input_ip1->send_keys('any:sub1');
    check_search_result($browser, 1, '1 result for: IP 1 = any:sub1 and exact');
    # Search
    $browser->clear_input($input_ip1);
    $input_ip1->send_keys('10.1.0.0/16');
    check_search_result($browser, 1, '1 result for: IP 1 = 10.1.0.0/16');
    # Search
    $input_subnet->click();
    check_search_result($browser, 11, '11 results for: IP 1 = 10.1.0.0/16 and subnet');
    # Search
    $input_subnet->click();
    $input_exact->click();
    $browser->find_child_element($container, './/div[contains(@class, "v-tab") and contains(text(), "Beschreibung")]')->click();
    my $input_description = $browser->find_child_element($container, './/input[@id="cb_search_description"]/../../../..');
    ok($input_description, 'Found checkbox: Description');
    my $input_string = $browser->find_child_element($container, './/input[@id="search_string"]');
    ok($input_string, 'Found input field: Search string');
    $input_string->send_keys('foo');
    check_search_result($browser, 2, '2 results for: Search key = foo and description');
    # Search
    $input_description->click();
    check_search_result($browser, 0, '0 results for: Search key = foo');
    # Search
    $browser->clear_input($input_string);
    $input_string->send_keys('Test9');
    check_search_result($browser, 1, '1 result for: Search key = Test9');
    # Search
    $browser->find_child_element($container, './/div[contains(@class, "v-tab") and contains(text(), "Regeln")]')->click();
    sleep 1;
    $browser->clear_input($input_ip1);
    $input_ip1->send_keys('10.2.2.2');
    $input_start->click();
    $browser->execute_script('window.scrollTo(0,0)');
    #$search_options->click();
    sleep 1;
    $browser->find_element('//div[contains(@class, "v-window-item--active")]//div[@id="table_services_searchresult"]//div[contains(@class, "tabulator-cell") and contains(text(), "Test9")]')->click();
    $browser->find_element('//input[@id="cb_show_names"]/../../../..')->click();
    my $details = $browser->find_element('//div[@id="table_services_rules"]');
    sleep 1;
    my @rules = $browser->find_child_elements($details, './/div[@class="tabulator-cell"]');
    my @rules = @rules[0..3];
    my @regex = ('permit', '10.2.2.2', '10.2.2.2', 'udp 83');
    TODO: {
        local $TODO = "Rules are not shown if names instead of IPs is not selected";
        #ok($browser->check_grid_syntax(\@rules, \@regex), 'Found rule for: IP 1 = 10.2.2.2');
        ok(0, 'Found rule for: IP 1 = 10.2.2.2');
    }
    # Filter checkbox
    $browser->find_element('//input[@id="cb_filter_search"]/../../../..')->click();
    sleep 1;
    my @rules = $browser->find_child_elements($details, './/div[@class="tabulator-cell"]');
    my @rules = @rules[0..3];
    my @regex = ('permit', "10.1.0.10\n10.2.2.2", "10.1.0.10,10.2.2.2", 'udp 83');
    TODO: {
        local $TODO = "Rules are not shown if names instead of IPs is not selected";
        #ok($browser->check_grid_syntax(\@rules, \@regex), 'Filter for search is correct');
        ok(0, 'Filter for search is correct');
    }
    $browser->execute_script('arguments[0].click()', $browser->find_element('//div[contains(@class, "v-tab") and contains(text(), "Eigene")]'));
}

# This function checks if the search finds the correct number of arguments
# Argument 0 => The expected number of search results
# Argument 1 => The message for the test output
sub check_search_result() {
    my ($browser, $expected, $message) = @_;
    $browser->find_element('.//button[@id="btn_search_start"]')->click();
    $browser->execute_script('window.scrollTo(0,0)');
    my $search_options = $browser->find_element('.//button[@id="btn_open_search"]');

    #$search_options->click();
    sleep 1;
    my @services = $browser->find_elements('//div[contains(@class, "v-window-item--active")]//div[@id="table_services_own"]//div[contains(@class, "tabulator-cell")]');
    ok(scalar @services == $expected, $message);
    $search_options->click();
    sleep 1;
}

1;
