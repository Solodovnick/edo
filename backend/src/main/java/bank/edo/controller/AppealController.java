package bank.edo.controller;
import bank.edo.dto.*;
import bank.edo.service.AppealService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
@RestController @RequestMapping("/api/appeals") @RequiredArgsConstructor
public class AppealController {
    private final AppealService svc;
    @GetMapping public Page<AppealListItemDto> getAll(
        @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="20") int size,
        @RequestParam(required=false) String search, @RequestParam(required=false) String status) {
        return svc.getAll(page,size,search,status);
    }
    @GetMapping("/{id}") public AppealDto getById(@PathVariable UUID id) { return svc.getById(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public AppealDto create(@Valid @RequestBody AppealCreateRequest req) { return svc.create(req); }
    @PatchMapping("/{id}")
    public AppealDto update(@PathVariable UUID id, @RequestBody AppealUpdateRequest req) { return svc.update(id,req); }
}