$(document).ready(() => {

  $('#sidebarCollapse').on('click', () => {
      $('#sidebar').toggleClass('active');
  });

  $('#logout').on('click', () => {
    fetch('/logout', { method: 'POST' });
    location.reload();
  });

});

