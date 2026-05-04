package bank.edo.controller;
import bank.edo.dto.AppealListItemDto;
import bank.edo.dto.AppealPageDto;
import bank.edo.repository.AppealRepository;
import bank.edo.service.AppealService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
public class AuditController {
    private final AppealService svc;
    private final AppealRepository repo;

    @GetMapping("/appeals")
    public AppealPageDto<AppealListItemDto> list(
        @RequestParam(required = false) String q,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "50") int size) {
        return AppealPageDto.from(svc.getAll(page, size, q, "На аудите", null));
    }

    @GetMapping("/appeals/{appealId}/log")
    public Object log(@PathVariable UUID appealId) {
        var appeal = repo.findById(appealId).orElseThrow(
            () -> new bank.edo.exception.AppealNotFoundException(appealId.toString()));
        var history = appeal.getHistory() != null ? appeal.getHistory() : java.util.List.of();
        var entries = history.stream().map(h -> java.util.Map.of(
            "id", h.getId() != null ? h.getId().toString() : "",
            "at", h.getRelatedDate() != null ? h.getRelatedDate().toString() : "",
            "actor", h.getRelatedNumber() != null ? h.getRelatedNumber() : "",
            "action", h.getRelatedStatus() != null ? h.getRelatedStatus() : "",
            "details", ""
        )).toList();
        return java.util.Map.of("appealId", appealId.toString(), "entries", entries);
    }
}
