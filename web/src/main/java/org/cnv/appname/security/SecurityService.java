/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cnv.appname.security;

/**
 *
 * @author Owner
 */
public interface SecurityService {

    String findLoggedInUsername();

    void autologin(String username, String password);
}
