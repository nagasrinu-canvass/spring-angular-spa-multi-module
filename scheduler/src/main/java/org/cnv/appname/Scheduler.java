/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cnv.appname;

import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

/**
 *
 * @author Owner
 */
@SpringBootApplication
@EnableScheduling
public class Scheduler {

    private static final Logger LOG = Logger.getLogger(Scheduler.class.getName());

    public static void main(String[] args) {
        ApplicationContext ctx = new SpringApplicationBuilder()
                .sources(Scheduler.class)
                .profiles("scheduler")
                .web(false)
                .run(args);
    }

    @Scheduled(fixedRate = 5000)
    public void reportCurrentTime() {
        LOG.log(Level.INFO, "The time is now {0}", new Date());
    }
}
