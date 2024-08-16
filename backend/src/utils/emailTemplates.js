export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Netflix Email Verification</title>
</head>
<body>
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #fff; padding: 20px; border-radius: 10px;">
          <tr>
            <td style="background-color: #e50914; color: #fff; padding: 5px; text-align: center;">
              <h1 style="font-size: 36px; margin-bottom: 10px;">Netflix</h1>
              <h2 style="font-size: 24px; margin-bottom: 20px;">Verify your email address</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Dear <span style="font-weight: bold;">{username}</span>,</p>
              <p style="font-size: 16px; margin-bottom: 20px;">We're excited to have you on Netflix! To complete your sign-up, please verify your email address by entering the following code:</p>
              <p style="font-size: 30px; font-weight: bold; text-align: center; margin-bottom: 20px;">{verificationCode}</p>
              <p style="font-size: 16px; margin-bottom: 20px;">If you didn't sign up for Netflix, please disregard this email.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 20px; text-align: center;">
              <p style="font-size: 14px; margin-bottom: 20px;">Best,</p>
              <p style="font-size: 14px; margin-bottom: 20px;">The Netflix Team</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
