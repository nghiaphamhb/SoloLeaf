package com.example.soloLeaf.service;

import com.example.soloLeaf.entity.*;
import com.example.soloLeaf.entity.keys.IdOrderItem;
import com.example.soloLeaf.payload.request.OrderRequest;
import com.example.soloLeaf.repository.OrderItemRepository;
import com.example.soloLeaf.repository.OrderRepository;
import com.example.soloLeaf.service.imp.OrderServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService implements OrderServiceImp {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    public boolean insertOrder(OrderRequest orderRequest) {
        try {
            Users user = new Users();
            user.setId(orderRequest.getUserId());

            Restaurant restaurant = new Restaurant();
            restaurant.setId(orderRequest.getResId());

            Order order = new Order();
            order.setUser(user);
            order.setRestaurant(restaurant);

            orderRepository.save(order);  // phai save truoc de tao order id tu dong

            List<OrderItem> items = new ArrayList<OrderItem>();
            for (int idFood: orderRequest.getFoodIds()) {
                Food food = new Food();
                food.setId(idFood);

                OrderItem orderItem = new OrderItem();
                IdOrderItem idOrderItem = new IdOrderItem(order.getId(), idFood);
                orderItem.setId(idOrderItem);
                orderItem.setFood(food);
                orderItem.setOrder(order);

                items.add(orderItem);
            }

            orderItemRepository.saveAll(items);
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }
}
