package com.example.soloLeaf.service;

import com.example.soloLeaf.dto.PromoDTO;
import com.example.soloLeaf.entity.Promo;
import com.example.soloLeaf.entity.Restaurant;
import com.example.soloLeaf.repository.PromoRepository;
import com.example.soloLeaf.repository.RestaurantRepository;
import com.example.soloLeaf.service.imp.PromoServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class PromoService implements PromoServiceImp {
    @Autowired
    PromoRepository promoRepository;

    @Autowired
    RestaurantRepository restaurantRepository;

    // Use a single RNG instance
    private final SecureRandom random = new SecureRandom();

    private static final int[] PERCENTS = {5, 10, 15, 20, 25};

    @Override
    public List<PromoDTO> getAllUnusedPromo() {
        List<Promo> list = promoRepository.findByUsedAtIsNull();
        List<PromoDTO> listDTO = new ArrayList<PromoDTO>();

        for (Promo promo : list) {
            PromoDTO dto = new PromoDTO(
                    promo.getId(),
                    promo.getCode(),
                    promo.getPercent(),
                    promo.getStartDate(),
                    promo.getEndDate(),
                    promo.getRestaurant().getId(),
                    promo.getRestaurant().getTitle()
            );
            listDTO.add(dto);
        }
        return listDTO;
    }

    @Override
    @Transactional
    public PromoDTO generatePromo() {

        List<Integer> restaurantIds = restaurantRepository.findAllIds();
        if (restaurantIds == null || restaurantIds.isEmpty()) {
            throw new IllegalStateException("No restaurants found");
        }

        // 1) Pick random restaurant id
        Integer resId = restaurantIds.get(random.nextInt(restaurantIds.size()));

        // 2) Load restaurant entity (needed for FK res_id)
        Restaurant restaurant = restaurantRepository.findById(resId)
                .orElseThrow(() -> new IllegalStateException("Restaurant not found: " + resId));

        // 3) Pick random percent
        int percent = PERCENTS[random.nextInt(PERCENTS.length)];

        // 4) Generate unique code
        String code = generateUniqueCode();

        // 5) Dates
        Date now = new Date();
        Date end = new Date(now.getTime() + 24L * 60 * 60 * 1000); // +1 day

        // 6) Insert promo
        Promo promo = new Promo();
        promo.setCode(code);
        promo.setRestaurant(restaurant);
        promo.setPercent(percent);
        promo.setStartDate(now);
        promo.setEndDate(end);
        promo.setUsedAt(null);
        promo.setOrder(null);

        Promo saved = promoRepository.save(promo);

        // 7) Map to DTO (response)
        PromoDTO dto = new PromoDTO();
        dto.setId(saved.getId());
        dto.setCode(code);
        dto.setPercent(percent);
        dto.setResId(restaurant.getId());
        dto.setResTitle(restaurant.getTitle());
        dto.setStartDate(now);
        dto.setEndDate(end);

        return dto;
    }

    private String generateUniqueCode() {
        for (int i = 0; i < 20; i++) {
            String code = "SL-" + randomToken(6);
            if (!promoRepository.existsByCode(code)) {
                return code;
            }
        }
        throw new IllegalStateException("Cannot generate unique promo code");
    }

    private String randomToken(int len) {
        final char[] alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".toCharArray();
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(alphabet[random.nextInt(alphabet.length)]);
        }
        return sb.toString();
    }
}
