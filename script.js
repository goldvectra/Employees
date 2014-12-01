var employees = [
];

$(document).ready(function(){
    render_employee_table(employees);
    $("#add").click(function() {
         console.log('add clicked');
         render_edit_box('add');
    });
})

function terminate_employee(index){ 
    console.log('terminate_employee index'+(index)+' id '+(employees[index].id))

    $.ajax({
        type: "DELETE",
        url: 'http://69.164.197.6/employees/'+employees[index].id,
    })
    .done(function (terminate_employee) {
        render_employee_table(employees)
    })
    render_employee_table(employees)
}

function render_edit_box(type, employee, index) {
    console.log("render_edit_box "+type)
    var pre_name = "";
    var pre_phone = "";
    var pre_address = "";

    if (type == "edit") {
        pre_name = employee.name;
        pre_phone = employee.phone;
        pre_address = employee.address;
    }
    var edit_html;
        edit_html= "<table class='table table-bordered'>";
        edit_html += "<tr><td>Name</td><td>Phone</td><td>Address</td></tr>";
        edit_html += "<tr>";
        edit_html += "<td><input type='text' id='edit_name' class='form-control' value='"+ pre_name +"'</td>";
        edit_html += "<td><input type='text' id='edit_phone' class='form-control' value='" + pre_phone + "'</td>";
        edit_html += "<td><input type='text' id='edit_address' class='form-control' value='" + pre_address + "'</td>";
        edit_html += "</tr>";

    //var edit_html = '<div class="edit_box">'+
    //                '<div><label>name</label>   <input type="text" id="edit_name"    class="form-control" value="' + pre_name + '"></div>' +
    //                '<div><label>phone</label>  <input type="tel"  id="edit_phone"   class="form-control" value="' + pre_phone + '"></div>' +
    //                '<div><label>address</label><input type="text" id="edit_address" class="form-control" value="' + pre_address + '"></div></div>';

    var button_name = type == "add" ? "add it" : "update it"; 

    edit_html += "<button id='saveit'>"+ button_name + "</button>";

    $('#edit_box').html(edit_html); 

    $('#edit_box').slideDown();

    $('#saveit').click(function(){
        var e = { 
            name : $("#edit_name").val(),
            phone: $("#edit_phone").val(),
            address: $("#edit_address").val()
        };
        if(type=="add") {
            add_employee(e);
        }
        else if (type=="edit") { 
            update_employee(e, index);
        }

         $("#edit_box").html('');

    })
}

function update_employee(data, index) {
    console.log("update Employee " + index);
    console.log(data);
    $.ajax({
        type: "POST",
        url: 'http://69.164.197.6/employees/update/' + employees[index].id +'?',
        data: {
            name: $("#edit_name").val(),
            phone: $("#edit_phone").val(),
            address: $("#edit_address").val()
        },
    })
    .done(function (update_employee) {
       render_employee_table(employees)
    })
}

function add_employee(data){    
    $.ajax({
        type: "POST",
        url: 'http://69.164.197.6/employees/',
        data: {
            name: $("#edit_name").val(),
            phone: $("#edit_phone").val(),
            address: $("#edit_address").val()
        },
    })        
    .done(function (add_employee) {
        render_employee_table(employees)
    })
}

function render_employee_table(data){
    console.log('render_employee_table')
    employees.splice(0, employees.length)
    $.ajax({
        url: 'http://69.164.197.6/employees/',
        success: function(data){
            populate_employee_table(data);
        }
    })
}

function populate_employee_table(data){
    console.log('populate_employee_table')
    var html;
    html = "<table class='table table-bordered'>";
    data.forEach(function(employee, index){
        html += "<tr>";
        html += "<td>"+ employee.name +"</td>";
        html += "<td>"+ employee.phone +"</td>";
        html += "<td>"+ employee.address +"</td>";
        html += "<td><button class='delete' index='"+index+"'>Del</button></td>";
        html += "<td><button index="+ index +" class='edit'>Edit</button></td>";
        html += "<td><button index="+ index +" class='map'>Map</button></td>"
        html += "</tr>";
        employees.push({
            name: employee.name,
            phone: employee.phone,
            address: employee.address,
            id: employee.id
        });
    })

    html += "</table>";

    $("#employee_list").html(html); 

    $(".map").click(function(){
        console.log("Map clicked!");
        // Run map location
        map_location(employees[$(this).attr("index")].address);
    })

    $(".delete").click(function(){
       console.log('delete clicked');
       terminate_employee($(this).attr("index"));
    });

    $('.edit').click(function(){
        console.log('clicked edit');
        render_edit_box('edit', employees[$(this).attr("index")] , $(this).attr("index"));
    })
}

// Map location - display address on the map.
function map_location(address){
    getGeo(address, function(error, location){
        map_initialize(location.lat, location.lng);
    })
}

function map_initialize(lat,lng)
{
    // setup the map
    var mapProp = {
      center:new google.maps.LatLng(lat,lng),
      zoom:15,
      mapTypeId:google.maps.MapTypeId.ROADMAP
      };

    // display the map
    var map=new google.maps.Map(document.getElementById("display_map")
      ,mapProp);


    // display the marker
    var myLatlng = new google.maps.LatLng(lat,lng);
    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Map Title'
  });
}

// Nate's getGeo function
 function getGeo(address, cb) {
        var api = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
        var key = 'AIzaSyBr0dQddZcPFvrPJwZfc-JEFlQzbbkr5sw';
 
        var url = api + address.replace(/\s/g, '+') + '&key=' + key;
 
        $.get(url, function(data){
          if(data.status && data.status === 'OK'){
            cb(null, data.results[0].geometry.location);
          } else {
            cb(data);
          }
        })
      }