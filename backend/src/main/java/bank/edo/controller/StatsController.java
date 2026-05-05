package bank.edo.controller;
import bank.edo.repository.AppealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
@RestController
@RequestMapping("/api/v1/stats")
@RequiredArgsConstructor
public class StatsController {
    private final AppealRepository repo;
    @GetMapping("/registrar/month")
    public Map<String, Long> registrarMonth() {
        long total = repo.count();
        long withErrors = repo.countByStatusIgnoreCase("Отказано");
        return Map.of(
            "withoutErrors", total - withErrors,
            "withErrors", withErrors,
            "total", total
        );
    }
}
