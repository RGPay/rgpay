package com.rgpay.pos.core.utils

import java.math.BigDecimal
import java.text.NumberFormat
import java.util.Locale

object CurrencyFormatter {
    
    private val brazilianFormat = NumberFormat.getCurrencyInstance(Locale("pt", "BR"))
    
    fun format(value: BigDecimal): String {
        return brazilianFormat.format(value)
    }
    
    fun format(value: Double): String {
        return brazilianFormat.format(value)
    }
    
    fun format(value: Int): String {
        return brazilianFormat.format(value)
    }
    
    fun parse(value: String): BigDecimal? {
        return try {
            val cleanValue = value.replace("R$", "").replace(".", "").replace(",", ".").trim()
            BigDecimal(cleanValue)
        } catch (e: NumberFormatException) {
            null
        }
    }
}
