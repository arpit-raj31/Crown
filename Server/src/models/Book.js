const bookSchema = new mongoose.Schema({
    type: { 
      type: String, 
      enum: ["A Book", "B Book"], 
      required: true 
    }, 
    accountId: { 
      type: String, 
      required: true, 
      ref: "User" 
    },
    customerName: { 
      type: String 
    },
    groupName: { 
      type: String 
    },
    fund: { 
      type: Number 
    },
    balance: { 
      type: Number 
    },
    equity: { 
      type: Number 
    },
    marginLevel: { 
      type: Number 
    },
    totalPnl: { 
      type: Number 
    },
    transactions: [
      {
        sNo: { 
          type: Number 
        },
        uid: { 
          type: String 
        },
        time: { 
          type: Date 
        },
        symbol: { 
          type: String 
        },
        lot: { 
          type: Number 
        },
        buyLot: { 
          type: Number 
        },
        sellLot: { 
          type: Number 
        },
        target: { 
          type: Number 
        },
        avg: { 
          type: Number 
        },
        exit: { 
          type: Number 
        },
        brokerage: { 
          type: Number 
        },
        pnl: { 
          type: Number 
        },
        copy: { 
          type: Boolean 
        },
        sector: { 
          type: String 
        },
        pair: { 
          type: String 
        },
        type: { 
          type: String 
        },
        trigger: { 
          type: String 
        },
        margin: { 
          type: Number 
        },
        reason: { 
          type: String 
        },
        book: { 
          type: String 
        },
        swap: { 
          type: Number 
        }
      }
    ]
  });
  
  module.exports = mongoose.model("Book", bookSchema);
       