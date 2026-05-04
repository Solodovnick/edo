package bank.edo.dto;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
@Data
public class AppealCreateRequest {
    @NotBlank(message="Тип обращения обязателен") private String appealType;
    @NotBlank(message="Категория заявителя обязательна") private String applicantCategory;
    @NotBlank(message="Текст обращения обязателен") private String content;
    @NotNull(message="Дедлайн обязателен") private LocalDate deadline;
    private String applicantName;
    private String organizationName;
    private String address;
    private String phone;
    private String email;
    private String cbs;
    private String appealCategory;
    private String appealSubcategory;
    private String responsible;
    private String registrar;
    private String createdBy;
    private String priority;
}