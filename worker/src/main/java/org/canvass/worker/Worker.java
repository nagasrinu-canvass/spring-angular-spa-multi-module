/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.canvass.worker;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ApplicationContext;

/**
 *
 * @author Owner
 */
@SpringBootApplication
public class Worker {

    public static void main(String[] args) {
        ApplicationContext ctx = new SpringApplicationBuilder()
                .sources(Worker.class)
                .profiles("worker")
                .web(false)
                .run(args);
    }
}
