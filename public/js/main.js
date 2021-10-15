$(document).ready(() => {

  // Toggle the side nav
  $('#sidebarCollapse').on('click', () => $('#sidebar').toggleClass('active'));

  // Logout the user when the logout button is pressed
  $('#logout').on('click', () => fetch('/logout', { method: 'POST' }));

  // Switch nav items
  $(() => {
    $('#nav li a').each(function () {
        if (location.pathname === $(this).attr("href")) $(this).addClass('active');
    })
})
});

