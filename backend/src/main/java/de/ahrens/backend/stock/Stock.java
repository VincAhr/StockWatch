package de.ahrens.backend.stock;


import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Stock {

    private List<StockData> data = new ArrayList<>();

}
