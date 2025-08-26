package com.rgpay.pos.features.tabs.clients

import com.rgpay.pos.core.network.HttpClient
import kotlinx.coroutines.delay

data class TabApiResponse(
    val id: String,
    val tableNumber: String?,
    val numberOfPayers: Int?,
    val items: List<TabItemApi>,
    val isCancelled: Boolean = false,
    val total: Double,
    val remaining: Double
)

data class TabItemApi(
    val id: String,
    val name: String,
    val price: Double,
    val quantity: Int,
    val quantityPaid: Int
)

data class UnitApiResponse(
    val id: String,
    val name: String,
    val restaurantName: String,
    val address: String?
)

class TabsApiClient(
    private val httpClient: HttpClient
) {
    
    // GET /comandas
    suspend fun getTabs(): List<TabApiResponse> {
        // Simulação de chamada API
        delay(1000)
        
        return listOf(
            TabApiResponse(
                id = "1",
                tableNumber = "Mesa 1",
                numberOfPayers = 2,
                items = listOf(
                    TabItemApi("1", "X-Burger", 15.90, 2, 1),
                    TabItemApi("2", "Refrigerante", 5.50, 2, 2)
                ),
                total = 42.80,
                remaining = 15.90
            ),
            TabApiResponse(
                id = "2",
                tableNumber = "Mesa 3",
                numberOfPayers = 4,
                items = listOf(
                    TabItemApi("3", "X-Salada", 18.90, 1, 1),
                    TabItemApi("4", "Batata Frita", 12.00, 1, 0)
                ),
                total = 30.90,
                remaining = 12.00
            )
        )
    }
    
    // GET /unidade/{unidadeId}
    suspend fun getUnit(unitId: String): UnitApiResponse {
        // Simulação de chamada API
        delay(500)
        
        return UnitApiResponse(
            id = unitId,
            name = "Unidade Centro",
            restaurantName = "Lorem ipsum Lanches",
            address = "Rua das Flores, 123 - Centro"
        )
    }
    
    // POST /comandas
    suspend fun createTab(tableNumber: String?, numberOfPayers: Int?): TabApiResponse {
        // Simulação de criação
        delay(800)
        
        return TabApiResponse(
            id = System.currentTimeMillis().toString(),
            tableNumber = tableNumber,
            numberOfPayers = numberOfPayers,
            items = emptyList(),
            total = 0.0,
            remaining = 0.0
        )
    }
    
    // PUT /comandas/{tabId}
    suspend fun updateTab(tabId: String, tab: TabApiResponse): TabApiResponse {
        // Simulação de atualização
        delay(600)
        
        return tab.copy(id = tabId)
    }
    
    // DELETE /comandas/{tabId}
    suspend fun cancelTab(tabId: String): Boolean {
        // Simulação de cancelamento
        delay(400)
        
        return true
    }
}
