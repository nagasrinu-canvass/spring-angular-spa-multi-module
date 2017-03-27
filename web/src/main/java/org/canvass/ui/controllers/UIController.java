/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.canvass.ui.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 * @author NavNag
 */
@Controller
public class UIController {

    @RequestMapping(path = {""}, method = RequestMethod.GET)
    public String login() {
        return "index";
    }

}
