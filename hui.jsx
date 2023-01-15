function HUI() {

    // Create a new window
    var win = new Window("dialog", "HUI", [0, 0, 200, 200]);

    // Create a button
    var btn = win.add("button", [0, 0, 100, 50], "Click Me");

    // Add an event handler to the button
    btn.onClick = function() {
        alert("Hello World!");
    }

    // Show the window
    win.show();




}