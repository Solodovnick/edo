package bank.edo.dto;
import org.springframework.data.domain.Page;
import java.util.List;
public record AppealPageDto<T>(
    List<T> items,
    int page,
    int size,
    long totalElements,
    int totalPages
) {
    public static <T> AppealPageDto<T> from(Page<T> p) {
        return new AppealPageDto<>(p.getContent(), p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages());
    }
}
