package back_end_Group_13.Domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String username;
    private String password;
    // Thêm dòng @Column này ngay trên biến của bạn
    @Column(name = "fullname")
    private String fullname;
    @Column(name = "account_number")
    private String accountnumber;
    private Double balance;

}
