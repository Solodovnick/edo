package bank.edo.dto;
import lombok.Data;
@Data
public class AppealUpdateRequest {
    private String status;
    private String solution;
    private String response;
    private String responsible;
    private String priority;
    private Boolean requiresAttention;
    private Boolean requiresSignature;
    private String auditStatus;
}