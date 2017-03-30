/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cnv.appname.ui.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 * @author NavNag
 */
@Controller
public class UIController {

    @RequestMapping(path = {"", "login", "login/user"}, method = RequestMethod.GET)
    public String loginUser() {
        return "login.user";
    }

    @RequestMapping(path = {"login/user"}, method = RequestMethod.POST)
    public String userHome() {
        return "user.index";
    }

    @RequestMapping(path = {"login/admin"}, method = RequestMethod.GET)
    public String loginAdmin() {
        return "login.admin";
    }

    @RequestMapping(path = {"login/admin"}, method = RequestMethod.POST)
    public String adminHome() {
        return "admin.index";
    }
}
