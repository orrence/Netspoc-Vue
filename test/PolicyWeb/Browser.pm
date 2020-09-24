package PolicyWeb::Browser;

use PolicyWeb::Init;
use base qw(Selenium::Remote::Driver);
use Selenium::Remote::WDKeys;

# This method returns a chrome browser instance
# Argument 0 => (Optional) The port of the selenium server as scalar
sub get_browser {
    my ($selenium_port) = @_;
    $selenium_port ||= "4444";
    PolicyWeb::Init::prepare_export();
    my ($server, $port) = PolicyWeb::Init::prepare_runtime_base();
    PolicyWeb::Init::setup_diff();
    return PolicyWeb::Browser->new('browser_name' => 'chrome', 'base_url' => "http://$server:$port", port => "$selenium_port");
}

# This method clears an input text field
# Argument 0 => The input text field
sub clear_input {
    my ($browser, $input) = @_;
    $input->send_keys(KEYS->{'control'}, 'a', KEYS->{'delete'});
}

# This method checks the syntax of the table cells
# Argument 0 => The cells of a table as array
# Argument 1 => The regular expressions to check the table cells as array
sub check_grid_syntax {
    my ($browser, $cellsA, $regexA) = @_;
    my @cells = @{$cellsA};
    my @regex = @{$regexA};
    for (my $row = 0; $row < scalar @cells; $row += scalar @regex) {
        for(my $column = 0; $column < scalar @regex; $column++) {
            if(!($cells[$row + $column]->get_text() =~ /$regex[$column]/)) {
                return 0;
            }
        }
    }
    return 1;
}

# This method checks if the grid is ordered
# Argument 0 => The cells of a table as array
# Argument 1 => The order of the row (1 for ascending or -1 for descending) as scalar
# Argument 2 => The number of columns per table row
# Argument 3 => The index of the column to be checked
sub is_grid_ordered {
    my ($browser, $cellsA, $order, $columns, $column) = @_;
    my @cells = @{$cellsA};
    for (my $row = $column; $row < scalar @cells - $columns; $row += $columns) {
        if(($cells[$row]->get_text() cmp $cells[$row + $columns]->get_text()) != $order) {
            return 0;
        }
    }
    return 1;
}

# This method checks the sorting of the table
# Argument 0 => The table to be checked as scalar
sub check_grid_order {
    my ($browser, $table) = @_;
    my @heads = $browser->find_child_elements($table, './div[contains(@class, "tabulator-header")]//div[@tabulator-field]');
    for (my $column = 0; $column < scalar @heads; $column++) {
        # Test ascending order
        $heads[$column]->click();
        @cells = $browser->find_child_elements($table, 'tabulator-cell', 'class');
        if($browser->is_grid_ordered(\@cells, 1, scalar @heads, $column)) {
            return 0;
        }
        # Test descending order
        $heads[$column]->click();
        @cells = $browser->find_child_elements($table, 'tabulator-cell', 'class');
        if($browser->is_grid_ordered(\@cells,  -1, scalar @heads, $column)) {
            return 0;
        }
    }
    return 1;
}

# This method checks if the table contains the given values
# Argument 0 => The table to be checked as scalar
# Argument 1 => The row of the table which shall contain the values as scalar
# Argument 2 => The values to search for as array
sub grid_contains {
    my($browser, $table, $row, $searchA) = @_;
    my @search = @{$searchA};
    foreach $text (@search) {
        @elements = $browser->find_child_elements($table, ".//div[$row][contains(\@class, 'tabulator-cell') and contains(text(), '$text')]");
        if (0 == scalar @elements) {
            return 0;
        }
    }
    return 1;
}

# This method lists the files of a given directory
# Argument 0 => The path of a directory as scalar
# Argument 1 => (Optional) The files to exclude in the output as array
sub list_files {
    my ($browser, $path, $excludeA) = @_;
    my $directory;
    my @exclude = @{$excludeA};
    opendir($directory, $path) or die "Cannot open directory: '$path'";
    my @files = readdir $directory;
    closedir($directory);
    if ($excludeA) {
        return $browser->array_remove(\@files, \@exclude);
    }
    return @files;
}

# This method removes elements from the array
# Argument 0 => The elements as array
# Argument 1 => The elements to remove from the other array as array
sub array_remove {
    my ($browser, $arrayA, $removeA) = @_;
    my @array = @{$arrayA};
    my @remove = @{$removeA};
    for (my $index = 0; $index < scalar @array; $index++) {
        foreach my $remove_element (@remove) {
            if ($array[$index] eq $remove_element) {
                for ($remove_index = $index; $remove_index < scalar @array - 1; $remove_index++) {
                    $array[$remove_index] = $array[$remove_index + 1];
                }
                pop(@array);
            }
        }
    }
    return @array;
}

# This method checks file downloads
# Argument 0 => The download button as scalar
# Argument 1 => The regular expression which will be tested against the file name of the download
sub download {
    my ($browser, $button, $regex) = @_;
    my @original_files = $browser->list_files("$ENV{HOME}/Downloads");
    $button->click();
    sleep 1;
    my @new_files = $browser->list_files("$ENV{HOME}/Downloads", \@original_files);
    if(scalar @new_files == 1) {
        unlink("$ENV{HOME}/Downloads/$new_files[0]");
    }
    return scalar @new_files == 1 && $new_files[0] =~ $regex;
}

# This method selects the given policy
# Argument 0 => The policy version (example 'p1') as scalar
sub select_policy {
    my ($browser, $policy) = @_;
    $browser->find_element('//input[@id="combo_policy"]')->click();
    $browser->find_element("//div[\@class='v-list-item__title' and contains(text(), '$policy')]")->click();
}

1;
