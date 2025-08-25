package com.rgpay.pos.features.tabs.domain

import com.rgpay.pos.features.tabs.data.models.RestaurantTabModel
import com.rgpay.pos.features.tabs.data.models.TabItem
import java.math.BigDecimal

class TabUseCase {
    
    fun addItemToTab(tab: RestaurantTabModel, item: TabItem): RestaurantTabModel {
        val updatedItems = tab.items.toMutableList().apply {
            add(item)
        }
        return tab.copy(items = updatedItems)
    }
    
    fun payItem(tab: RestaurantTabModel, itemName: String, quantity: Int): RestaurantTabModel {
        val updatedItems = tab.items.map { item ->
            if (item.name == itemName) {
                val newQuantityPaid = (item.quantityPaid + quantity).coerceAtMost(item.quantity)
                item.copy(quantityPaid = newQuantityPaid)
            } else item
        }
        return tab.copy(items = updatedItems)
    }
    
    fun cancelTab(tab: RestaurantTabModel): RestaurantTabModel {
        return tab.copy(isCancelled = true)
    }
    
    fun updateNumberOfPayers(tab: RestaurantTabModel, numberOfPayers: Int): RestaurantTabModel {
        return tab.copy(numberOfPayers = numberOfPayers)
    }
    
    fun calculateTotal(tab: RestaurantTabModel): BigDecimal {
        return tab.items.fold(BigDecimal.ZERO) { acc, item -> 
            acc + (item.price * BigDecimal(item.quantity)) 
        }
    }
    
    fun calculateRemaining(tab: RestaurantTabModel): BigDecimal {
        return tab.items.fold(BigDecimal.ZERO) { acc, item ->
            acc + (item.price * BigDecimal(item.quantity - item.quantityPaid))
        }
    }
    
    fun isTabPaid(tab: RestaurantTabModel): Boolean {
        val total = calculateTotal(tab)
        val remaining = calculateRemaining(tab)
        return total > BigDecimal.ZERO && remaining == BigDecimal.ZERO
    }
}
