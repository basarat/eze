export const mainIndex = ({title}: {title: string}) => `
<!DOCTYPE html>
<html>
<head>
    <!-- Standard Meta -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width">
    <title>${title}</title>
    <script src="../data.js"></script>
</head>

<body>
  <div id="eze-application-root"></div>
  <script src="./app.js"></script>
</body>
</html>
`.trim();