package com.rgpay.pos.features.tabs.data.models

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import java.math.BigDecimal

// Classe base
open class RestaurantTabModelBase(
    open val tableNumber: String? = null,
    open val numberOfPayers: Int? = null,
    open val items: List<TabItem> = emptyList()
)

// Item da comanda
data class TabItem(
    val name: String,
    val price: BigDecimal,
    val id: String,
    var quantity: Int = 0,
    var quantityPaid: Int = 0
)

// Comanda em rascunho (não persistida)
data class DraftTab(
    override val tableNumber: String? = null,
    override val numberOfPayers: Int? = null,
    override val items: List<TabItem> = emptyList(),
    val isDraft: Boolean = true
) : RestaurantTabModelBase(tableNumber, numberOfPayers, items)

// Comanda persistida
data class RestaurantTabModel(
    override val tableNumber: String? = null,
    override val numberOfPayers: Int? = null,
    override val items: List<TabItem> = emptyList(),
    val isCancelled: Boolean = false
) : RestaurantTabModelBase(tableNumber, numberOfPayers, items) {

    val total: BigDecimal
        get() = items.fold(BigDecimal.ZERO) { acc, item -> acc + (item.price * BigDecimal(item.quantity)) }

    val remaining: BigDecimal
        get() = items.fold(BigDecimal.ZERO) { acc, item ->
            acc + (item.price * BigDecimal(item.quantity - item.quantityPaid))
        }

    val isPaid: Boolean
        get() = total > BigDecimal.ZERO && remaining == BigDecimal.ZERO

    fun markAsCancelled() = this.copy(isCancelled = true)
}

class RestaurantTabViewModel(initialTab: RestaurantTabModel) : ViewModel() {

    private val _tab = MutableStateFlow(initialTab)
    val tab: StateFlow<RestaurantTabModel> = _tab

    // Adiciona item à comanda
    fun addItem(item: TabItem) {
        _tab.update { current ->
            val updatedItems = current.items.toMutableList().apply {
                add(item)
            }
            current.copy(items = updatedItems)
        }
    }

    // Marca item como pago
    fun payItem(itemName: String, quantity: Int) {
        _tab.update { current ->
            val updatedItems = current.items.map { item ->
                if (item.name == itemName) {
                    val newQuantityPaid = (item.quantityPaid + quantity).coerceAtMost(item.quantity)
                    item.copy(quantityPaid = newQuantityPaid)
                } else item
            }
            current.copy(items = updatedItems)
        }
    }

    // Marca comanda como cancelada
    fun cancelTab() {
        _tab.update { it.markAsCancelled() }
    }

    // Atualiza o número de pagantes
    fun updateNumberOfPayers(numberOfPayers: Int) {
        _tab.update { it.copy(numberOfPayers = numberOfPayers) }
    }

    // Calculados dinamicamente na UI
    val total: BigDecimal
        get() = _tab.value.total

    val remaining: BigDecimal
        get() = _tab.value.remaining

    val isPaid: Boolean
        get() = _tab.value.isPaid
}

