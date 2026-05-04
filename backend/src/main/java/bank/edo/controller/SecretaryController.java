package bank.edo.controller;
import bank.edo.dto.AppealListItemDto;
import bank.edo.dto.AppealPageDto;
import bank.edo.service.AppealService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/v1/secretary")
@RequiredArgsConstructor
public class SecretaryController {
    private final AppealService svc;

    @GetMapping("/appeals")
    public AppealPageDto<AppealListItemDto> list(
        @RequestParam(defaultValue = "На ПК") String status,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "50") int size) {
        return AppealPageDto.from(svc.getAll(page, size, null, status, null));
    }
}
