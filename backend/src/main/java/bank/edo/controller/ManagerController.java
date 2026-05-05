package bank.edo.controller;
import bank.edo.repository.AppealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
@RestController
@RequestMapping("/api/v1/manager")
@RequiredArgsConstructor
public class ManagerController {
    private final AppealRepository repo;

    @GetMapping("/dashboard/summary")
    public Map<String, Long> summary() {
        long total = repo.count();
        long closed = repo.countByStatusIgnoreCase("Закрыто")
            + repo.countByStatusIgnoreCase("В архиве")
            + repo.countByStatusIgnoreCase("Пройден аудит");
        long open = total - closed - repo.countByStatusIgnoreCase("Отказано");
        long atRisk = repo.countByStatusIgnoreCase("Запрос в БП")
            + repo.countByStatusIgnoreCase("Готово к подписи");
        return Map.of("openAppeals", open, "atRisk", atRisk, "closedThisMonth", closed);
    }
}
