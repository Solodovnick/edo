package bank.edo.controller;
import bank.edo.dto.*;
import bank.edo.service.AppealService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
@RestController @RequestMapping("/api/v1/appeals") @RequiredArgsConstructor
public class AppealController {
    private final AppealService svc;
    @GetMapping public AppealPageDto<AppealListItemDto> getAll(
        @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="20") int size,
        @RequestParam(required=false) String q,
        @RequestParam(required=false) String search,
        @RequestParam(required=false) String status,
        @RequestParam(required=false) String category) {
        String query = q != null ? q : search;
        return AppealPageDto.from(svc.getAll(page, size, query, status, category));
    }
    @GetMapping("/{id}") public AppealDto getById(@PathVariable UUID id) { return svc.getById(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public AppealDto create(@Valid @RequestBody AppealCreateRequest req) { return svc.create(req); }
    @PatchMapping("/{id}")
    public AppealDto update(@PathVariable UUID id, @RequestBody AppealUpdateRequest req) { return svc.update(id,req); }
}