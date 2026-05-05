package bank.edo.controller;
import bank.edo.dto.AppealListItemDto;
import bank.edo.dto.AppealPageDto;
import bank.edo.service.AppealService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/v1/responsible")
@RequiredArgsConstructor
public class ResponsibleController {
    private static final List<String> RESPONSIBLE_STATUSES =
        List.of("Назначено", "На ответственном, взято", "Запрос в БП", "Готово к подписи");

    private final AppealService svc;

    @GetMapping("/appeals")
    public AppealPageDto<AppealListItemDto> list(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String q,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "50") int size) {
        String effectiveStatus = (status != null && !status.isBlank())
            ? status : String.join(",", RESPONSIBLE_STATUSES);
        return AppealPageDto.from(svc.getAll(page, size, q, effectiveStatus, null));
    }
}
