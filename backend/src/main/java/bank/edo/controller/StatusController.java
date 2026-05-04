package bank.edo.controller;
import bank.edo.entity.AppealStatus;
import bank.edo.repository.AppealStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/statuses") @RequiredArgsConstructor
public class StatusController {
    private final AppealStatusRepository repo;
    @GetMapping public List<AppealStatus> getAll() { return repo.findAll(Sort.by("sortOrder")); }
}