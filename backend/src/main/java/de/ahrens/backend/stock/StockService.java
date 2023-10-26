package de.ahrens.backend.stock;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.security.Principal;
import java.util.List;
import java.util.Optional;



@Service
@RequiredArgsConstructor
public class StockService {

    @Value("${app.marketstack.password}")
    String pw;

    private final StockRepository stockRepository;


    public StockDTO searchStock(String stockSymbol) {

        final String API_TICKER_URL = "http://api.marketstack.com/v1/tickers/" + stockSymbol + "/eod?access_key=" + pw + "&limit=1";

        try {
            ResponseEntity<StockData> response = new RestTemplate().getForEntity(API_TICKER_URL, StockData.class);

            if (response.getStatusCode() == HttpStatus.OK) {

            Stock stock = response.getBody().getData();

            String name = stock.getName();
            String symbol = stock.getSymbol();
            String close = String.valueOf(stock.getEod().get(0).getClose());
            String date = String.valueOf(stock.getEod().get(0).getDate());

            return new StockDTO(name, symbol, close, date);


             /*
            JsonObject jsonObject = JsonParser.parseString(Objects.requireNonNull(response.getBody())).getAsJsonObject();
            JsonObject data = jsonObject.getAsJsonObject("data");
            String name = data.get("name").getAsString();
            String symbol = data.get("symbol").getAsString();
            String close = data.getAsJsonArray("eod").get(0).getAsJsonObject().get("close").getAsString();
            String date = data.getAsJsonArray("eod").get(0).getAsJsonObject().get("date").getAsString();
            return new StockData(symbol, name, close, date);
            */

        } else {
            return null;
        }

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public StockDTO addStock(StockDTO newStock, Principal principal) {
        newStock.setUser(principal.getName());
        return stockRepository.save(newStock);
    }

    public StockDTO updateStock(StockDTO stockData, Principal principal) {
        if (stockRepository.findById(stockData.getId()).isPresent()) {
            stockData.setUser(principal.getName());
            stockRepository.save(stockData);
        }
        return stockData;
    }

    public List<StockDTO> getAllSaved(Principal principal) {
        return stockRepository.findAllByUser(principal.getName());
    }

    public StockDTO deleteStock(String idToDelete, Principal principal) {
        Optional<StockDTO> stock = stockRepository.findByIdAndUser(idToDelete, principal.getName());
        StockDTO stockData = stock.orElseThrow(() -> new IllegalArgumentException("Nothing found with ID: " + idToDelete));
        stockRepository.delete(stockData);
        return stockData;
    }
}
