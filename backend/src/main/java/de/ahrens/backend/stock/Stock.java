package de.ahrens.backend.stock;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Stock {

    @Id
    private String id;
    @JsonProperty
    private String symbol;
    @JsonProperty
    private String name;

    private String user;
    private String shares;
    private String purchase;

    private List<Eod> eod = new ArrayList<>();

}
