package com.showcase.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DataSourceConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Bean
    public DataSource dataSource() throws URISyntaxException {
        if (databaseUrl == null || databaseUrl.trim().isEmpty()) {
            // Fallback for local development
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl("jdbc:postgresql://localhost:5432/modular_showcase");
            config.setUsername("postgres");
            config.setPassword("admin123");
            return new HikariDataSource(config);
        }

        // Render provides DATABASE_URL in the format: postgres://user:password@host:port/database
        URI dbUri = new URI(databaseUrl);

        String username = dbUri.getUserInfo().split(":")[0];
        String password = dbUri.getUserInfo().split(":")[1];
        
        // Convert to JDBC URL
        String jdbcUrl = "jdbc:postgresql://" + dbUri.getHost() + ':' + 
                         (dbUri.getPort() != -1 ? dbUri.getPort() : 5432) + dbUri.getPath();
                         
        // Sometimes external connections need SSL, but internal Render connections don't strictly require it.
        // We'll leave it as is, Render handles it internally via the provided connection string.

        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(jdbcUrl);
        hikariConfig.setUsername(username);
        hikariConfig.setPassword(password);
        
        // Add resilience: wait for DB to be ready instead of crashing immediately
        hikariConfig.setInitializationFailTimeout(0); 
        hikariConfig.setConnectionTimeout(30000);

        return new HikariDataSource(hikariConfig);
    }
}
