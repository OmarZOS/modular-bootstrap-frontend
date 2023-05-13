


function handleFileUpload(event,schemaName) {
    var file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: function(results) {
        var data = results.data;
        var columns = getColumns(schemaName,data)
        var table = $('#insertion-table').DataTable({
            data:data,
            language:{url: datatables_language_file_path},
            paging: true, // Enable pagination
            lengthChange: false, // Disable changing the number of records per page
            searching: true, // Disable search feature
            ordering: false, // Enable column sorting
            info: true, // Show table information
            pagingType: 'full_numbers', // Set the pagination style
            pageLength: 9, // Set the number of records to display per page
            columns: columns,
            columnDefs: [{
              targets: -1,
              render: function(data, type, row,meta) {
                // Custom formatting/rendering logic for the first column
                if (type === 'display') {
                    return '<span style="min-width: 0px;">' + '<button class="btn btn-danger btn-sm delete-row delete-button"><span class="icon"><i class="fas fa-trash-alt fa-sm"></i></span></button>' + '</span>'; // Apply red color to the data
                }
                return '<button class="btn btn-danger btn-sm delete-row delete-button"><span class="icon"><i class="fas fa-trash-alt fa-sm"></i></span></button>';
              }
            }],
            select: true,
            initComplete: function() {
                // Iterate through each column
                this.api().columns().every(function() {
                  var column = this;
                  var columnIndex = column.index();

                  if (columnIndex != (columns.length - 1)) {
                    // Create a dropdown element
                    var dropdown = $('<div class="dropdown"></div>');
            
                    // Create a button for the dropdown toggle
                    //var toggleButton = $('<button class="btn btn-primary container-fluid dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>');
                    //toggleButton.text(this.header().textContent.trim());
                      
                    // Create a dropdown menu
                    var dropdownMenu = $('<select class="form-control exclusive-select"><option value="">' + "" + '</option></select>');
            
                    // Add menu items to the dropdown menu
                    $.each(getMetaColumnNames("Trainees"), function(i, item) {
                      dropdownMenu.append('<option value="' + item + '">' + item + '</option>');
                    });
            
                    // Append the toggle button and dropdown menu to the dropdown element
                    //dropdown.append(toggleButton);
                    //dropdown.append(dropdownMenu);
            
                    // Replace the column title with the dropdown element
                    $(this.header()).html(dropdownMenu);
                  }
                    
                    


                });
              }
        });


        var focusedCell = null;

        $("#insertion-table tbody").on('click', 'td.editable', function() {
          if (focusedCell && focusedCell.is($(this))) {
            return;
          }

          focusedCell = $(this);
          var cellValue = focusedCell.text().trim();

          if (focusedCell.has('input').length > 0) {
            return;
          }

          var input = $('<input type="text" class="form-control">').val(cellValue);

          focusedCell.empty().append(input);
          input.focus();

          input.on('blur', function() {
            var newValue = $(this).val();
            focusedCell.text(newValue);
            focusedCell = null;
          });
        });

            $("#insertion-table tbody").on('keydown', 'td.editable', function(e) {
            if (e.key === 'Escape' && focusedCell) {
                var cellValue = focusedCell.find('input').val();
                focusedCell.text(cellValue);
                focusedCell = null;
            }
            });
            $('#insertion-table tbody').on('click', '.delete-row', function() {
            var row = $(this).closest('tr');
            table.row(row).remove().draw();
            });

        }
        });
  }



function getColumns(schemaName,data) {
    var columns = [];

    // Get the column names from the first row of data
    var columnNames = Object.keys(data[0]);

    // Create column definitions
    columnNames.forEach(function(columnName) {
      columns.push({ data: columnName,
                    //  title: columnName,
                     className:"editable" });
    });

    // Add the delete button column
    columns.push({
      data: null,
      orderable: false,
      searchable: false
    });

    return columns;
  }





