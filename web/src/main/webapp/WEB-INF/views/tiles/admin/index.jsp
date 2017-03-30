<%-- 
    Document   : Index Page    
    Author     : NavNag
--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html ng-app="appAdmin">
    <head>
        <title>&lt;App Name&gt; Admin</title>
        <link rel="icon" type="image/png" href="/res/favicon.ico">
        <!-- Tell the browser to be responsive to screen width -->
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">

        <link href='https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css' rel='stylesheet' type='text/css' />
        <link href='/res/bootstrap/css/bootstrap.min.css' rel='stylesheet' type='text/css' />
        <link href='/res/themes/adminlte/AdminLTE.min.css' rel='stylesheet' type='text/css' />
        <link href='/res/themes/adminlte/_all-skins.min.css' rel='stylesheet' type='text/css' />
        <link href='/res/css/common.css' rel='stylesheet' type='text/css' />
    </head>
    <body class="skin-blue sidebar-mini" ng-controller="mainController">
        <div class="wrapper">
            <header class="main-header">
                <a href="/" class="logo">
                    <!-- mini logo for sidebar mini 50x50 pixels -->
                    <span class="logo-mini"><b>&lt;App Name&gt;</b></span>
                    <!-- logo for regular state and mobile devices -->
                    <span class="logo-lg"><b>&lt;App Name&gt;</b></span>
                </a>

                <!-- Header Navbar: style can be found in header.less -->
                <nav class="navbar navbar-static-top">
                    <!-- Sidebar toggle button-->
                    <a href="" class="sidebar-toggle" data-toggle="offcanvas" role="button">
                        <span class="sr-only">Toggle navigation</span>
                    </a>      
                </nav>
            </header>
            <aside class="main-sidebar">
                <!-- sidebar: style can be found in sidebar.less -->
                <section class="sidebar" style="height: auto;" ng-controller="sidebarController">
                    <!-- Sidebar user panel -->
                    <div class="user-panel">        
                        <div class="pull-left image">
                            <img src="/res/images/logo.png" class="img-circle" alt="User Image">
                        </div>
                        <div class="pull-left info">
                            <p>Admin</p>
                            <a href="/admin/logout"><i class="fa fa-power-off"></i> Logout</a>
                        </div>
                    </div>    
                    <!-- sidebar menu: : style can be found in sidebar.less -->
                    <ul class="sidebar-menu">        
                        <li>
                            <a href="#dashboard">
                                <i class="fa fa-dashboard"></i> <span>Dashboard</span>                
                            </a>
                        </li>
                        <li class="treeview">
                            <a href>
                                <i class="fa fa-wrench"></i>
                                <span>Multilevel Menu</span>
                                <span class="pull-right-container">
                                    <i class="fa fa-angle-left pull-right"></i>
                                </span>
                            </a>
                            <ul class="treeview-menu">
                                <li>
                                    <a href="#">
                                        <i class="fa fa-user"></i> <span>Level 1</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i class="fa fa-user-md"></i> <span>Level 2</span>
                                    </a>
                                </li>                                
                            </ul>
                        </li>
                    </ul>
                </section>                
                <!-- /.sidebar -->
            </aside>
            <div class="content-wrapper">
                <section class="content">
                    <div id="main">
                        <!-- angular templating -->
                        <!-- this is where content will be injected -->
                        <div ng-view></div>
                    </div>
                </section>
            </div>
            <footer class="main-footer">
                <div class="pull-right hidden-xs">
                    <b>Version</b> 1.0.0
                </div>
                <strong>Copyright © 2016-2017 <a href="">&lt;App Name&gt;</a>.</strong> All rights reserved.
            </footer>
        </div>

        <!--Styles that are needed for the initial app rendering -- START --> 

        <!--Styles that are needed for the initial app rendering -- END -->

        <script src='/res/js/jquery.min.js'></script>
        <script src='/res/js/angular.min.js'></script>
        <script src='/res/js/angular-sanitize.min.js'></script>
        <script src='/res/js/angular-route.min.js'></script>
        <script src='/res/bootstrap/js/bootstrap.min.js'></script>
        <script src='/res/themes/adminlte/app.min.js'></script>

        <!--Plugins -- START -->        
        <script src='/res/js/moment.min.js'></script>
        <!--Plugins -- END -->

        <script src='/res/js/cnv-angular.js'></script>        
        <script src='/res/js/com.naga.basic.js'></script>
        <script src='/res/admin/js/admin.js'></script>
        <script type="text/javascript" src="/res/admin/js/app.js"></script>

        <!--    Components     -->

        <!--    Controllers     -->        
    </body>
</html>
