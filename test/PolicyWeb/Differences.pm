package PolicyWeb::Differences;

use Test::More;

# This function runs the tests for the differences
# Argument 0 => The browser as scalar
sub test {
    my ($browser) = @_;
    $browser->select_policy('p2');
    subtest 'Check services with different policies' => sub {test_services($browser)};
    subtest 'Check differences' => sub {test_differences($browser)};
    $browser->select_policy('p1');
}

# This function runs the tests for the services tab
# Argument 0 => The browser as scalar
sub test_services {
    my ($browser) = @_;
    $browser->find_element('//a[@id="tab_services"]')->click();
    $browser->find_element('//div[contains(@class, "v-tab") and text()="Eigene"]')->click();
    sleep 1;
    # Find changed services
    my $services = $browser->find_element('//div[contains(@class, "v-window-item--active")]/div[@id="table_services_own"]');
    ok(0 == scalar @{$browser->find_child_elements($services, './/div[@class="tabulator-cell" and text()="Test10"]')}, 'Test 10 removed');
    ok(1 == scalar @{$browser->find_child_elements($services, './/div[@class="tabulator-cell" and text()="Test11"]')}, 'Found service test 11');
    ok(1 == scalar @{$browser->find_child_elements($services, './/div[@class="tabulator-cell" and text()="Test12"]')}, 'Found service test 12');
    # Find changed protocoll
    $browser->find_child_element($services, './/div[@class="tabulator-cell" and text()="Test11"]')->click();
    ok(1 == scalar @{$browser->find_elements('//div[@class="tabulator-cell" and @tabulator-field="prt" and text()="tcp 83"]')}, 'Changed protocoll of test 11');
}

# This function runs the tests for the differences tab
# Argument 0 => The browser as scalar
sub test_differences {
    my ($browser) = @_;
    $browser->find_element('//a[@id="tab_diff"]')->click();
    # Find elements
    ok(1 == scalar @{$browser->find_elements('//h3[contains(text(), "Vergleiche den ausgew") and contains(text(), "hlten Stand mit einem ") and contains(text(), "lteren")]')}, 'Found heading');
    ok(1 == scalar @{$browser->find_elements('//input[@id="combo_compare_policies"]')}, 'Found combo older policies');
    ok(0 == scalar @{$browser->find_elements('//div[@class="v-treeview-node__label"]')}, 'No tree without chosen policy');
    $browser->find_element('//input[@id="combo_compare_policies"]')->click();
    $browser->find_element('//div[@class="v-list-item__title" and not(contains(text(), " | p"))]')->click();
    sleep 1;
    @elements = $browser->find_elements('//div[@class="v-treeview-node__label"]');
    @regex = ('services', 'Test11', 'rules', '1', 'prt', 'icon-add', 'tcp 83', 'icon-delete', 'tcp 84', 'service_lists owner', 'icon-page_edit', 'Test11', 'icon-add', 'Test12', 'icon-delete', 'Test10');
    TODO: {
        $TODO = "Test9 is in the list if the differences test is executed after the services test";
        ok($browser->check_grid_syntax(\@elements, \@regex), 'Differences tree contains all information');
    }
}

1;
