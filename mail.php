<?php

$data = json_decode(file_get_contents('php://input'), true);

if(!empty($data)) {

    $to      = 's3rv3r@inbox.ru';

    // Subject
    $subject = 'Заявка с сайта svs-msk.ru';

    // Message
    $message = '
    <html>
    <head>
      <title>Заявка с сайта</title>
    </head>
    <body>
      <p>Добрый день !</p>
      <p>Получена заявка с сайта svs-msk.ru</p>
      <p>Наш потенциальный клиент оставил следующую информацию:</p>
      <table cellspacing="15" cellpadding="0">
        <thead>
          <tr>
            <th align="left">Имя: </th>
            <td>' . $data['name'] . '</td>
          </tr>
          <tr>
            <th align="left">Email: </th>
            <td>' . $data['email'] . '</td>
          </tr>
          <tr>
            <th align="left">Телефон: </th>
            <td>' . $data['phone'] . '</td>
           </tr>
           <tr>
            <th align="left">Тип оборудования: </th>
            <td>' . $data['equipment_type'] . '</td>
          </tr>
          <tr>
            <th align="left">Способ связи: </th>
            <td>' . $data['notification_method'] . '</td>
          </tr>
      </table>
    </body>
    </html>
    ';

    $headers   = [
        'MIME-Version' => 'MIME-Version: 1.0',
        'Content-type' => 'text/html; charset=UTF-8',
        'From' => "{$data['name']} <{$data['email']}>",
        'Reply-To' => $data['email'],
        'X-Mailer' => 'PHP/' . phpversion(),
    ];

    mail($to, $subject, $message, $headers);

}