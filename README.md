# Spring-angular-Template
A spring boot application with angular as a client side framework (Single Page Application)

The standard template contains 4 modules
- Domain (holds the all the business logic)
- Web (Serves only the web and API's)
- Scheduler (to schedule the jobs)
- Worker (run heavy jobs in the background)

## Setting up the template to work
- make sure that you have renamed all the packages (Domain, Web, Scheduler and Worker) that starts with "org.cnv.appname" to "org.cnv.&lt;appname&gt;"
- Under "Domain" make sure to modify all the properties according to the project settings (DB Credentials, S3 access credentials and other)

## How to add a new page
- open Web module
- go to "res/admin/pages" and add a new page here (somepage.html)
- Now open the app.js file under "res/admin/js" add the new entry to the $routeProvider as shown below

```javascript
    $routeProvider
      .when('/<url-path>', {
        templateUrl: '<src path>',
        controller: '<controller name>'
      });            
```

## How to add a new menu
- open Web module
- open the file "index.jsp" under "WEB-INF/views/tiles/admin" folder
- add the following code to the existing ul which hacing class "sidebar-menu"
```html
    <li>
      <a href="#dashboard"><i class="fa fa-dashboard"></i> <span>Dashboard</span></a>
    </li>    
```

## Run the WEB Application
open the file Application.java in the **"org.cnv.&lt;appname&gt;"** package and run the file
