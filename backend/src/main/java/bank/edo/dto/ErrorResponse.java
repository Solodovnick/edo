package bank.edo.dto;
import lombok.*;
import java.time.LocalDateTime;
@Data @AllArgsConstructor
public class ErrorResponse {
    private int status;
    private String error;
    private String message;
    private LocalDateTime timestamp;
    public static ErrorResponse of(int s, String e, String m) {
        return new ErrorResponse(s, e, m, LocalDateTime.now());
    }
}