<%-- 
    Document   : login.jsp
    Created on : 28 Aug, 2016, 3:46:24 PM
    Author     : NavNag
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>Admin Login</title>
        <link rel="icon" type="image/png" href="/res/favicon.ico">
        <!-- Tell the browser to be responsive to screen width -->
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">

        <link href='/res/bootstrap/css/bootstrap.min.css' rel='stylesheet' type='text/css' />
        <link href='/res/themes/adminlte/AdminLTE.min.css' rel='stylesheet' type='text/css' />
        <link href='/res/themes/adminlte/_all-skins.min.css' rel='stylesheet' type='text/css' />

        <script src='https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js'></script>
        <script src='/res/bootstrap/js/bootstrap.min.js'></script>
        <script src='/res/themes/adminlte/app.min.js'></script>
    </head>
    <body class="hold-transition login-page">
        <div class="login-box">
            <div class="login-logo">
                <a href="/">&lt;App Name&gt;</a>
            </div>
            <div class="login-box-body">
                <p class="login-box-msg">Sign in to start your session</p>
                <form action="/login/admin" method="POST">
                    <div class="form-group has-feedback">
                        <input name="loginId" type="text" class="form-control" placeholder="Login Id">
                        <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                    </div>
                    <div class="form-group has-feedback">
                        <input name="password" type="password" class="form-control" placeholder="Password">
                        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                    </div>
                    <div class="row">
                        <div class="col-xs-8">            
                        </div>
                        <div class="col-xs-4">
                            <button type="submit" class="btn btn-primary btn-block btn-flat">Sign In</button>
                        </div>        
                    </div>
                </form>
                <a href="#">I forgot my password</a>
            </div>
        </div>
    </body>
</html>


