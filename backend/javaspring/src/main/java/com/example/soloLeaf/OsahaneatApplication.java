package com.example.soloLeaf;

import com.example.soloLeaf.config.VapidProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({ VapidProperties.class })
public class OsahaneatApplication {

	public static void main(String[] args) {
		SpringApplication.run(OsahaneatApplication.class, args);
	}

}
