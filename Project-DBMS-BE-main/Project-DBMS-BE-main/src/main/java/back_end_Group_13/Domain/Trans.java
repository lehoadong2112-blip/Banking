package back_end_Group_13.Domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "Transactions")
@Getter
@Setter
public class Trans {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "sender_id")
    private Integer senderId;

    @Column(name = "receiver_id")
    private Integer receiverId;

    private Double amount;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String content;

    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;

    @Column(name = "status", columnDefinition = "NVARCHAR(50)")
    private String status = "Thành công";
}
