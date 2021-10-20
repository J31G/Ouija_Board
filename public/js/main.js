$(document).ready(() => {

  // Toggle the side nav
  $('#sidebarCollapse').on('click', () => $('#sidebar').toggleClass('active'));

  // Logout the user when the logout button is pressed
  $('#logout').on('click', () => $.post( '/logout' ));

  // Switch nav items
  $(() => {
    $('#nav li a').each(function () {
        if (location.pathname === $(this).attr("href")) $(this).addClass('active');
    });
  });

  // Init toast notifications
  const toastElList = [].slice.call(document.querySelectorAll('.toast'));
  const toastList = toastElList.map((toastEl) => {
    return new bootstrap.Toast(toastEl);
  });

  // Manual input: get value
  $( '#manual-submit' ).on( 'click' , () => {

    // SEND WORD TO BOARD
    sendWord( $( '#inputLarge' ).val() );

    $( '#word-display' ).text( $( '#inputLarge' ).val() );
    $( '#inputLarge' ).val('');

    toastList.forEach((toast) => toast.show());

  });

  // Send word
  const sendWord = async (word) => {
    await $.post( '/board/word', { 'word': word } );
  }

  // Get char data from config page
  $('#configSubmit').on('click', async () => {
    const charArray = [];
    $('.characters').each((i, el) => {
      charArray.push({
        char: $(el).find('label > strong').text().replace(/[^A-Za-z0-9]+/gi, ''),
        X: $(el).find('div > div:nth-child(1) > input').val(),
        Y: $(el).find('div > div:nth-child(2) > input').val(),
      });
    });
    const reply = await $.post( '/config', { data: charArray, extra: { delay: $('#delay').val() } } );
    if(reply.statusCode === 200) location.reload();
  });

  $('#initSubmit').on('click', async () => {
    $.post( '/board/init' );
  });

});

