package PolicyWeb::Networks;

use Test::More;

# This method runs the tests for the networks tab
# Argument 0 => The browser for the tests
sub test {
    my ($browser) = @_;
    subtest 'Navigate' => sub {test_navigate($browser)};
    subtest 'Networks grid' => sub {test_networks_grid($browser)};
    subtest 'Ressources grid' => sub {test_ressources_grid($browser)};
}

# This method tests the navigation tab
# Argument 0 => The browser for the tests
sub test_navigate {
    my ($browser) = @_;
    $browser->find_element_by_id('tab_networks')->click();
    ok($browser->get_current_url() =~ '/networks', 'Networks tab');
}

# This method tests the network table
# Argument 0 => The browser for the tests
sub test_networks_grid {
    my ($browser) = @_;
    ok(1 == scalar @{$browser->find_elements('//h3[text()="Netzauswahl"]')}, 'Found text Netzauswahl');
    my $table = $browser->find_element('//h3[text()="Netzauswahl"]/..//div[@class="tabulator"]');
    ok($table, 'Found grid network');
    my @cells = $browser->find_child_elements($table, 'tabulator-cell', 'class');
    my @regex = ('(1\d\d|\d\d?).(1\d\d|\d\d?).(1\d\d|\d\d?).(1\d\d|\d\d?)', '(network|interface):.*', 'x|y|z');
    ok($browser->check_grid_syntax(\@cells, \@regex), 'Networks grid looks fine');
    ok(3 == scalar @{$browser->find_child_elements($table, './div[@class="tabulator-header"]//div[@tabulator-field]')}, 'Found network grid header');
    ok($browser->check_grid_order($table), 'Network grid order changes');
    # Test the network downloads
    ok($browser->download($browser->find_element('//h3[text()="Netzauswahl"]/..//span[@class="material-icons" and text()="picture_as_pdf"]'), /\.pdf$/), 'Download network pdf');
    ok($browser->download($browser->find_element('//h3[text()="Netzauswahl"]/..//span[@class="material-icons" and text()="border_all"]'), /\.xlsx$/), 'Download network xlsx');
}

# This method tests the ressources table
# Argument 0 => The browser for the tests
sub test_ressources_grid {
    my ($browser) = @_;
    ok(1 == scalar @{$browser->find_elements('//h3[text()="Enthaltene Ressourcen"]')}, 'Found text: Enthaltene Ressourcen');
    my $table = $browser->find_element('//h3[text()="Enthaltene Ressourcen"]/..//div[@class="tabulator"]');
    ok($table, 'Found grid: Ressourcen');
    ok(3 == scalar @{$browser->find_child_elements($table, './div[@class="tabulator-header"]//div[@tabulator-field]')}, 'Found header: Ressources grid');
    ok(0 == scalar @{$browser->find_child_elements($table, 'tabulator-cell', 'class')}, 'No network ressources, if no network is selected');
    # Select network 'Big'
    my $network_table = $browser->find_element('//h3[text()="Netzauswahl"]/..//div[@class="tabulator"]');
    $browser->find_child_element($network_table, './/div[@class="tabulator-cell" and text()="network:Big"]')->click();
    sleep 1;
    ok(1 == scalar @{$browser->find_child_elements($table, './/div[contains(@class, "tabulator-group") and contains(text(), "network:Big")]')}, 'Found group: network:Big');
    my @names = ('host:B10', 'host:Range', 'interface:asa.Big', 'interface:u.Big');
    ok($browser->grid_contains($table, 'child_name', \@names), 'network ressources for network:Big');
    ok($browser->check_grid_order($table), 'Ressources grid order changes');
    # Select network 'Kunde'
    $browser->find_child_element($network_table, './/div[@class="tabulator-cell" and text()="network:Kunde"]')->click();
    sleep 1;
    ok(1 == scalar @{$browser->find_child_elements($table, './/div[contains(@class, "tabulator-group") and contains(text(), "network:Kunde")]')}, 'Found group: network:Kunde');
    # Check syntax
    my @regex = ('(1\d\d|\d\d?).(1\d\d|\d\d?).(1\d\d|\d\d?).(1\d\d|\d\d?)', '(host|interface):.*', 'x|y|z|');
    my @cells = $browser->find_child_elements($table, 'tabulator-cell', 'class');
    ok($browser->check_grid_syntax(\@cells, \@regex), 'Ressources grid looks fine');
    # Test the ressources downloads
    ok($browser->download($browser->find_element('//h3[text()="Enthaltene Ressourcen"]/..//span[@class="material-icons" and text()="picture_as_pdf"]'), /\.pdf$/), 'Download ressources pdf');
    ok($browser->download($browser->find_element('//h3[text()="Enthaltene Ressourcen"]/..//span[@class="material-icons" and text()="border_all"]'), /\.xlsx$/), 'Download ressources xlsx');
}

1;
