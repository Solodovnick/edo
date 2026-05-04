package bank.edo.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Value("${edo.cors.allowed-origins:http://localhost:5173,http://localhost:4173}") private String[] allowedOrigins;
    @Override public void addCorsMappings(CorsRegistry r) {
        r.addMapping("/api/**").allowedOrigins(allowedOrigins)
         .allowedMethods("GET","POST","PATCH","PUT","DELETE","OPTIONS")
         .allowedHeaders("*").allowCredentials(true).maxAge(3600);
    }
}