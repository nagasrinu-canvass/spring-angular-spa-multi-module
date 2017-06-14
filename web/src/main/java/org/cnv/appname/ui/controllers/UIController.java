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
        return "login";
    }

    @RequestMapping(path = {"/admin/index"}, method = RequestMethod.GET)
    public String adminIndex() {
        return "admin/index";
    }
}
